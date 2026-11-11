/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin, { PluginNative } from "@utils/types";

import { AUDIO_FILTERS } from "./filters.js";

declare const VencordNative: any;
const Native = VencordNative.pluginHelpers.VoiceEnhancer as PluginNative<typeof import("./native")>;

export default definePlugin({
    name: "VoiceEnhancer",
    description: "Enhances voice quality with advanced audio processing and noise reduction",
    authors: [Devs.Ven],
    
    async start() {
        const filterData = atob(AUDIO_FILTERS);
        const filterArray = Array.from(filterData, char => char.charCodeAt(0));
        
        await Native.initialize(filterArray);
    },
    
    stop() {
        Native.cleanup();
    }
});
