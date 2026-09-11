# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Run on a mobile phone (same Wi-Fi)

1. Start the backend on the computer as usual.
2. In the frontend folder run:
   `npm install`
3. Start Vite so other devices can reach it:
   `npm run dev -- --host 0.0.0.0`
4. Find the computer's local IPv4 address (Windows: `ipconfig`).
5. On the phone connected to the same Wi-Fi, open:
   `http://YOUR-PC-IP:5173`

The frontend uses Vite's `/api` proxy during development, so API requests go to the backend on the same computer instead of trying to call `localhost` on the phone.
