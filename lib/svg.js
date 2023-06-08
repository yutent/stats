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
  let y = 32 + ~~(idx / 2 + 1) * 36
  let x1 = idx % 2 === 0 ? 27 : 227
  let x2 = idx % 2 === 0 ? 44 : 244
  return html`
    <g class="lang">
      <circle cx="${x1}" cy="${y}" r="5" fill="${color}" />
      <text x="${x2}" y="${y + 4}">${name} ${pc}%</text>
    </g>
  `
}

function pie(langs = [], sum = 0, height) {
  // 圆心坐标
  let cx = 540
  let radius = ~~((height - 64) / 2) // 最小半径
  let cy = radius + 48
  let per = 0.25
  let deg = per * 2 * Math.PI // 从90度开始计算

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

export function render({ title = 'Most Used Languages', langs = [] } = {}) {
  let sum = langs.reduce((n, it) => n + it.size, 0)
  let height = ~~(langs.length / 2 + 1) * 36 + 32
  if (height < 140) {
    height = 140
  }

  return html`
    <svg
      width="800"
      height="${height}"
      viewBox="0 0 800 ${height}"
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
      <g transform="translate(24, 32)">
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

      <g class="lang-pie">${pie(langs, sum, height)}</g>
    </svg>
  `
}
