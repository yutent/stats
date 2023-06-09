/**
 * {}
 * @author yutent<yutent.io@gmail.com>
 * @date 2023/06/07 18:41:20
 */

function html(strs, ...vals) {
  let output = ''
  for (let it of strs) {
    output += it + (vals.shift() ?? '')
  }
  return output
}

function text({ color, name, pc, idx }) {
  let y = 32 + ~~(idx / 2 + 1) * 32
  let x1 = idx % 2 === 0 ? 12 : 212
  let x2 = idx % 2 === 0 ? 24 : 224
  return html`
    <g class="lang">
      <circle cx="${x1}" cy="${y}" r="5" fill="${color}" />
      <text x="${x2}" y="${y + 4}">${name} ${pc}%</text>
    </g>
  `
}

function pie(langs = [], sum = 0, height, mobile) {
  let per = 0.25
  let deg = per * 2 * Math.PI // 从90度开始计算
  // 圆心坐标,半径
  let cx, cy, radius

  if (mobile) {
    radius = 72
    cx = 192 - 16
    cy = ~~(langs.length / 2 + 1) * 32 + 32 + radius
  } else {
    radius = ~~((height - 64) / 2) - (langs.length > 10 ? 24 : 0) // 最小半径
    cx = langs.length > 12 ? 520 : langs.length <= 6 ? 384 : 464
    cy = radius + (langs.length > 10 ? 64 : 48)
  }

  return langs
    .map((it, idx) => {
      // 扇形起始坐标
      let r = +radius.toFixed(3)
      let lx = +(cx + Math.sin(deg) * r).toFixed(3)
      let ly = +(cy - Math.cos(deg) * r).toFixed(3)
      let nx, ny
      let _per = +(it.size / sum).toFixed(4)

      radius *= 1.05
      per += _per
      deg = per * 2 * Math.PI
      nx = +(cx + Math.sin(deg) * r * (per > 0.5 ? 1 : -1)).toFixed(3)
      ny = +(cy - Math.cos(deg) * r).toFixed(3)

      return html`
        <path
          class="pie pie-${idx}"
          d="M${cx} ${cy} L${lx} ${ly} A${r} ${r} 0 ${_per > 0.5
            ? 1
            : 0} 1 ${nx} ${ny} Z"
          fill="${it.color}"
        />
      `
    })
    .join('')
}

export function render(
  { title = 'Most Used Languages', langs = [] } = {},
  mobile = false
) {
  let sum = langs.reduce((n, it) => n + it.size, 0)
  let height = ~~(langs.length / 2 + 1) * 32 + 32
  let width = 736
  if (height < 140) {
    height = 140
  }

  if (langs.length < 5) {
    width -= 304
  } else if (langs.length > 4 && langs.length < 7) {
    width -= 240
  } else if (langs.length > 6 && langs.length <= 12) {
    width -= 144
  }

  if (mobile) {
    width = 384
    height = ~~(langs.length / 2 + 1) * 32 + 36 + 72 * 2
  }

  return html`
    <svg
      viewBox="0 0 ${width} ${height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        .header {
          font: bold 22px 'Segoe UI', Ubuntu, Sans-Serif;
          fill: #64b5f6;
        }
        .lang {
          font: 14px Menlo, Monaco, Consolas, 'Courier New', monospace;
          fill: #64748b;
        }
        .lang-pie {
          fill: #64748b;
        }
        .pie {
          opacity: 0;
          animation: fade 0.5s ease-in-out forwards;
        }
        ${langs
            .map((it, i) => `.pie-${i} {animation-delay: ${i * 100}ms}`)
            .join('\n')}
          @keyframes
          fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      </style>
      <g transform="translate(6, 32)">
        <text class="header">${title}</text>
      </g>
      <g class="lang-list">
        ${langs
          .map((it, idx) =>
            text({
              color: it.color,
              name: it.name,
              pc: +((100 * it.size) / sum).toFixed(2),
              idx
            })
          )
          .join('')}
      </g>

      <g class="lang-pie">${pie(langs, sum, height, mobile)}</g>
    </svg>
  `
}
