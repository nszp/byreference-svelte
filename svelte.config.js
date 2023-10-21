import sveltePreprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-vercel';

const mode = process.env.NODE_ENV;
const dev = mode === "development";
process.env.TAILWIND_MODE = dev ? "watch" : "build";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
  compilerOptions: null,

  // an array of file extensions that should be treated as Svelte components
  extensions: [".svelte"],

  preprocess: [
    sveltePreprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter({}),
    amp: false,
    appDir: "_app",
    files: {
      assets: "static",
      hooks: "src/hooks",
      lib: "src/lib",
      routes: "src/routes",
      serviceWorker: "src/service-worker",
      template: "src/app.html",
    },
    floc: false,
    hydrate: true,
    paths: {
      assets: "",
      base: "",
    },
    prerender: {
      crawl: true,
      enabled: true,
      onError: 'fail',
      entries: ["*"],
    },

    router: true,
    ssr: true,
    vite: () => ({}),
  },
};

export default config;
