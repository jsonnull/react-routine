import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'

const env = process.env.NODE_ENV

const config = {
  input: 'src/index.js',
  external: ['react'],
  output: {
    name: 'ReduxRender',
    format: 'umd',
    globals: {
      react: 'React'
    }
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs()
  ]
}

export default config
