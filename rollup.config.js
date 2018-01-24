import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

const input = 'src/index.ts'

const plugins = [ typescript() ]

export default [
  {
    input,
    plugins,
    output: {
      file: pkg.module,
      format: 'es'
    }
  },
  {
    input,
    plugins,
    output: {
      file: pkg.main,
      format: 'cjs'
    }
  }
]
