/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { IpcMainInvokeEvent } from "electron";
import path from "path";
import fs from "fs";

// Load native module from Discord modules directory
let nativeModule: any = null;
const discordAppPath = process.execPath.replace(/\\[^\\]+\.exe$/, "");
const possiblePaths = [
    path.join(discordAppPath, "modules", "discord_audio_filters-1", "discord_audio_filters.node"),
    path.join(process.env.LOCALAPPDATA || "", "Discord", "app-1.0.9267", "modules", "discord_audio_filters-1", "discord_audio_filters.node")
];

for (const tryPath of possiblePaths) {
    try {
        if (fs.existsSync(tryPath)) {
            nativeModule = require(tryPath);
            break;
        }
    } catch (e) {
        // Silent fail
    }
}

let loaded = false;

export async function initialize(_event: IpcMainInvokeEvent, filterBufferArray: number[]) {
    if (loaded) return true;
    
    if (!nativeModule) {
        return false;
    }
    
    try {
        const filterBuffer = Buffer.from(filterBufferArray);
        const success = nativeModule.loadProcessor(filterBuffer);
        
        if (success) {
            loaded = true;
        }
        
        return success;
    } catch (e) {
        return false;
    }
}

export function cleanup(_event: IpcMainInvokeEvent) {
    loaded = false;
}

export async function getConfig(_event: IpcMainInvokeEvent) {
    if (!loaded || !nativeModule) {
        return null;
    }
    
    try {
        const config = nativeModule.getConfig();
        return config;
    } catch (e) {
        return null;
    }
}

export async function setConfig(_event: IpcMainInvokeEvent, config: any) {
    if (!loaded || !nativeModule) {
        return false;
    }
    
    try {
        const result = nativeModule.setConfig(config);
        return result;
    } catch (e) {
        return false;
    }
}
