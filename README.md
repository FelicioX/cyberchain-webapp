# CyberChain WebApp

CyberChain WebApp is a decentralized finance (DeFi) frontend built with React, TypeScript and Web3 technologies. The application provides a modern interface for interacting with blockchain smart contracts, cryptocurrency wallets and decentralized finance protocols.

Originally developed as the frontend of the CyberChain ecosystem, this repository preserves both the original application source code and its production build for historical and educational purposes.

---

## Overview

The project was developed to provide a responsive Web3 interface capable of connecting users to blockchain networks and decentralized finance services.

Its architecture combines React, TypeScript and Web3 libraries to create a modern decentralized application (DApp) with wallet connectivity and smart contract interaction.

---

## Features

- React-based decentralized application (DApp)
- TypeScript architecture
- Web3 smart contract integration
- Cryptocurrency wallet connectivity
- Decentralized finance (DeFi) interface
- Responsive user interface
- Modular component architecture
- Cloudflare Workers deployment support
- Production build included
- Modern frontend structure

---

## Technologies

### Frontend

- React
- TypeScript
- HTML5
- CSS3
- Styled Components

### Blockchain

- Web3.js
- use-wallet
- Smart Contract Integration
- Wallet Connection

### Infrastructure

- Node.js
- Yarn
- Create React App
- Cloudflare Workers
- Cloudflare KV Assets

---

## Repository Structure

```
cyberchain-webapp/
│
├── source/
│   ├── public/
│   ├── src/
│   ├── workers-site/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── yarn.lock
│
├── build/
│   ├── static/
│   ├── index.html
│   ├── asset-manifest.json
│   ├── manifest.json
│   └── ...
│
├── README.md
├── LICENSE
├── CHANGELOG.md
├── SECURITY.md
└── .gitignore
```

---

## Source Code

The **source/** directory contains the complete React application, including:

- Application source code
- React components
- TypeScript configuration
- Web3 integration
- Cloudflare Workers configuration
- Project dependencies

---

## Production Build

The **build/** directory contains the compiled production version of the application generated from the original source code.

It has been preserved to document the original deployment version of the project.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/FelicioX/cyberchain-webapp.git
```

Navigate to the source directory:

```bash
cd cyberchain-webapp/source
```

Install dependencies:

```bash
npm install
```

or

```bash
yarn
```

Start the development server:

```bash
npm start
```

or

```bash
yarn start
```

Generate a production build:

```bash
npm run build
```

---

## Requirements

- Node.js
- npm or Yarn
- Modern web browser
- Web3 compatible wallet (optional)

---

## Security

Sensitive production credentials and deployment-specific configuration have been intentionally omitted from this repository.

---

## Historical Note

This repository preserves the original CyberChain WebApp architecture as part of a blockchain development portfolio.

Both the original source code and the compiled production build are included to maintain the historical integrity of the project.

---

## License

This project is distributed under the MIT License.

See the LICENSE file for additional information.
