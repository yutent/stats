/**
 * {}
 * @author yutent<yutent.io@gmail.com>
 * @date 2023/06/07 18:41:20
 */

function html(strs, ...vals) {
  let output = ''
  for (let it of strs) {
    output += it + (vals.shift() || '')
  }
  return output
}

export function render({ title = 'Most Used Languages' }) {
  return html`
    <svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        .header {
          font: bold 20px 'Segoe UI', Ubuntu, Sans-Serif;
          fill: #64b5f6;
        }
      </style>
      <g transform="translate(24, 32)">
        <text class="header">${title}</text>
      </g>
    </svg>
  `
}
