import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const STUB_ID = '\0next-navigation-stub'
const STUB_EXPORTS = [
  'export const useParams = () => ({})',
  'export const usePathname = () => "/"',
  'export const useSearchParams = () => new URLSearchParams()',
  'export const useRouter = () => ({ push: () => {}, replace: () => {}, back: () => {}, forward: () => {} })',
  'export const redirect = () => {}',
  'export const notFound = () => {}',
  'export const permanentRedirect = () => {}',
].join('\n')

const nextNavigationStub = {
  name: 'stub-next-navigation',
  enforce: 'pre' as const,
  resolveId(id: string) {
    if (id === 'next/navigation' || id === 'next/navigation.js') return STUB_ID
  },
  load(id: string) {
    if (id === STUB_ID || id.includes('__vite-optional-peer-dep:next/navigation')) {
      return STUB_EXPORTS
    }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nextNavigationStub],
})
