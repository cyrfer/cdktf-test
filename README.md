
# Solorepo
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

# Monorepo Conversion
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
