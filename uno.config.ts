import {defineConfig, presetIcons, presetUno} from 'unocss'
import presetWind from '@unocss/preset-wind'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
    presets: [
        presetUno(),
        presetWind(),
        presetIcons({cdn: 'https://esm.sh/'})
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
    shortcuts: [
        [/^wh-(.*)$/, ([, t]) => `w-${t} h-${t}`],
        [/^text-limit-(\d{0,})$/, ([, n]) => `line-clamp-${n}`],
        {
            rel: 'relative',
            abs: 'absolute',
            fix: 'fixed',
        },
        {
            'fx-cer': 'flex items-center',
            'f-cer': 'flex items-center justify-center',
        },
        {
            'shadow-card': 'shadow-[0_6px_8px_0_rgba(28,31,35,6%)]'
        }
    ],
    rules: [
        [
            'shadow-base',
            {
                'box-shadow': '0px 0px 12px rgba(0, 0, 0, .12)',
            },
        ],
    ],
    theme: {
        colors: {
            black: "#0a0a0a",
            main9: '#f9f9f9',
            params: '#F2F2F2',
            icon: '#72767b',
            variable: '#67a4f9',
            variable_bg: '#eef2f8',
            trash: '#ff0000',
            code: "#0000ff",
            codeBg: "#f7f7f7",
            symbol: "#0431fa",
            panel: "#f7f7fa",
            co: "#060709",
            glass: "hsla(0, 0%, 98%, .8)",
            glass1: "hsla(0, 0%, 92%, .65)",
            menu: "#F4F4F6",
        },
    },
})
