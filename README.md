
# An attempt to use CDKTF

followed instructions here:
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
