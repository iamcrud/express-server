# iamcrud-react

A CRUD implementation with React stack

## Installation

```
git clone https://github.com/pfraces/iamcrud-react
cd iamcrud-react
npm install
```

## Usage

From project root, start the development server:

```
npm start
```

Browse to <http://localhost:3000>

### Production

```
npm run build
```

Builds the app for production to the `build/` folder

## Architecture

- **Starter:** Create React App
- **Preprocessors:** TypeScript, Sass, TSX
- **Standard library:** CoreJS (polifills), RxJS, Lodash
- **Ajax:** Epics + RxJS.ajax
- **State management:** Redux w/ useSelector
- **Business rules:** Custom Hooks
- **Router:** React router
- **CSS architecture:** Sass themes + CSS modules
- **CSS layout:** Grid
- **Component library:** Material UI
- **Unit testing:** Jest + expectObservable
- **Backend mock:** Express + LowDB
- **Linters & formatting:** ESLint + Prettier

See more details about this architecture at
<https://gist.github.com/pfraces/4bd5d138f49f44a77dbbb029295cc5b1>

### Starter: Create React App

```
npm init react-app my-app --use-npm --template typescript
```

References:

- <https://reactjs.org/docs/create-a-new-react-app.html#create-react-app>
- <https://create-react-app.dev/>
- <https://github.com/facebook/create-react-app>
