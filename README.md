# cdtkf-test
A starter repo for showing how to organize a monorepo that is compatile with the Terraform CDKTF.

## Current usage
First, you must specify values in [packages/app-1/.env](./packages/app-1/.env), resembling

```bash
ATLAS_PUBLIC_KEY="ommitted"
ATLAS_PRIVATE_KEY="ommitted"
ATLAS_ORGANIZATION_ID="ommitted"
```

Then, execute the following:
```bash
git clone THIS_REPO
npm install
npm run build -w packages/mongo
npm run deploy -w packages/app-1
npm run destroy -w packages/app-1
```

# History of changes
## Solorepo
I used CDKTF successfully by following instructions here:
https://learn.hashicorp.com/tutorials/terraform/cdktf-install?in=terraform/cdktf


I executed the following:
```bash
cdktf init --template=typescript --local
npm install @cdktf/provider-aws
mkdir src
mv main.ts src/
```

Then I did the following modifications, because not doing these things is crazy.
1. changed [tsconfig.json](./tsconfig.json) to have
   1. `"outDir": "dist"` as well as 
   2. `"include": ["src/**/*.ts"]` 
2. changed [cdktf.json](./cdktf.json) to have `src` in the path, i.e.
   1. `"app": "npx ts-node src/main.ts",`

I modified [src/main.ts](./src/main.ts) so that it has the code you see now.

Then I synthesized using `npm run synth`.

## Monorepo Conversion
To create a monorepo structure, I executed
```bash
mkdir packages
mkdir packages/app-1
mv package.json src __tests__ cdktf.json packages/app-1
rm -rf node_modules package-lock.json cdktf.out
npm init --scope=mycompany
```

The I added the following to the new top-level [package.json](./package.json)
```json
  "workspaces": [
    "packages/app-1"
  ],
```

and then I installed the dependencies again via
```bash
npm i
```

which shows `node_modules` ONLY in the top-level directory.

and finally I showed the CDKTF still synthesizes via
```bash
npm run synth -w packages/app-1
```

## Mongo infra library
Mongo's terraform provider can be used to generate typescript support for CDKTF.

```bash
npm init --scope=mycompany -w packages/mongo
npm i -D typescript ts-jest ts-node jest @types/jest @types/node -w packages/mongo/
npm i -S cdktf constructs -w packages/mongo
cp packages/app-1/cdktf.json packages/mongo/
mkdir packages/mongo/src
touch packages/mongo/src/index.ts
```

For [mongo/cdktf.json](./packages/mongo/cdktf.json),
1. I removed the keys `app` and `projectId` from 
2. I added a value within the `terraformProviders` array:
```json
  "terraformProviders": [
    "mongodb/mongodbatlas"
  ],
```

I added the following scripts to [mongo/package.json](./packages/mongo/package.json)

```json
    "cdktf-get": "cdktf get",
    "build": "tsc",
    "postinstall": "cdktf get"
```

I added the following properties to [mongo/package.json](./packages/mongo/package.json)

```json
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts",
  "files": [
    "/dist/src"
  ],
```

I setup the tsconfig file, remembering [app-1](./packages/app-1/) also needed it.
```bash
cp tsconfig.json packages/app-1/
cp tsconfig.json packages/mongo/
```

The [mongo/tsconfig.json](./packages/mongo/tsconfig.json) file needed changes to be able to find the generated code.
```json
  "include": [
    "src/**/*",
    ".gen/**/*"
  ],
```

With the structure in place to build a library, I added the [code](./packages/mongo/src/index.ts), and I built the library by executing:

```bash
npm run cdktf-get -w packages/mongo
npm run build -w packages/mongo
npm install @mycompany/mongo -w packages/app-1
```

I added an [.env](./packages/app-1/.env) file to pass sensitive params.

I updated the code in app-1 to use the library via `import {...} from '@mycompany/mongo'` and built via:
```bash
npm i -D env-cmd -w packages/app-1
npm run build -w packages/app-1
npm run synth -w packages/app-1
npm run deploy -w packages/app-1
```
