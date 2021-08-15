require("dotenv").config();
const express = require('express')
const Ceramic = require("@ceramicnetwork/http-client").default;
const ceramic = new Ceramic('https://ceramic-clay.3boxlabs.com');
const ThreeIdResolver = require("@ceramicnetwork/3id-did-resolver").default;
const KeyDidResolver = require("key-did-resolver").default;
const { Ed25519Provider } = require("key-did-provider-ed25519");
const { DID } = require("dids");
const { randomBytes } = require('@stablelib/random');
const { TileDocument } =  require('@ceramicnetwork/stream-tile');

const dbSchema = require("./schemas/main.json");
const recSchema = require("./schemas/records.json");
const mocData = require("./data/data.json");

const app = express();
const port = 3000

async function UpdateDB(STREAM_ID){
    const metadata = {
            controllers: [ceramic.did.id],
            family: 'niftidb',
            schema: "k3y52l7qbv1frxqx0t6qkfrp0mh7guvgt2ythx1ylo4l0axqj9zxw50at6ckqlo1s",
    }
    let database = await TileDocument.load(ceramic, "kjzl6cwe1jw149nt5bsoyni2pd74yoemp43k8g6kr789lebgklj3jjx2ps0qngv");
    let old = database.content.data;
    old.push({"streamId": STREAM_ID});
    await database.update({"data": old}, metadata);
    return 1;
}

async function loadData(obj){
    let recSchemaLd = await TileDocument.load(ceramic, "kjzl6cwe1jw14azx5fej1eq6dsu0j6lo0mh5eiqrt0eo768oq9z1t4e8r2om9zq");
        const rec = await TileDocument.create(ceramic, {
           tag: obj.name,
           lat: obj.latitude,
           long: obj.longtitude,
          }, {
            controllers: [ceramic.did.id],
            family: 'niftidb',
            schema: recSchemaLd.commitId.toString(),
          });
          console.log(`Record ID: ${rec.id.toString()}`);
          x = await UpdateDB(rec.id.toString());
          console.log(`fineshed loading ${rec.id.toString()} with status code: ${x}`);
}

async function run() {

    const provider = new Ed25519Provider(
        Uint8Array.from(process.env.THREE_ID_SEED.split(",").map(Number.parseInt))
    );
    
    const resolver = { ...KeyDidResolver.getResolver(),
        ...ThreeIdResolver.getResolver(ceramic) }
    ceramic.did = new DID({ resolver });
    ceramic.did.setProvider(provider);
    await ceramic.did.authenticate();




    app.get('/', (req, res) => {
        
        res.send('Hello Worsld!')
    })

    app.get('/createStream', async (req, res) => {
        const doc = await TileDocument.create(ceramic, {hello: 'world'});
        const streamId = doc.id.toString();
        res.send(streamId);
    });

    app.get('/recordSchema', async (req, res) => {
        //const doc = await TileDocument.create(ceramic, {hello: 'world'});
        const metadata = {
            controllers: [ceramic.did.id] // this will set yourself as the controller of the schema
        }
        const recordSchema = await TileDocument.create(ceramic, recSchema, metadata)
        const streamId = recordSchema.id.toString();
        res.send(streamId);
    });

    app.get('/crtDb', async (req, res) => {
        let dbSchemald = await TileDocument.load(ceramic, "kjzl6cwe1jw146liocrczytyeesm23asu89rtyl6f7e7csdal3d7bycrq7e5zo7");
        const db = await TileDocument.create(ceramic, {
           data: []
          }, {
            controllers: [ceramic.did.id],
            family: 'niftidb',
            schema: dbSchemald.commitId.toString(),
          });
          //console.log(dbSchemald.commitId.toString());
          res.send(db.id.toString());
    });
    app.get('/crtRec', async (req, res) => {
        let recSchemaLd = await TileDocument.load(ceramic, "kjzl6cwe1jw14azx5fej1eq6dsu0j6lo0mh5eiqrt0eo768oq9z1t4e8r2om9zq");
        const rec = await TileDocument.create(ceramic, {
           tag: 'hello',
           lat: 40.7166638,
           long: -74.0,
          }, {
            controllers: [ceramic.did.id],
            family: 'niftidb',
            schema: recSchemaLd.commitId.toString(),
          });
          console.log(`Record ID: ${rec.id.toString()}`);
          x = await UpdateDB(rec.id.toString());
          console.log(x);
          if(x){
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
          
    });

    app.get('/loadit', async (rec, res) => {
        for(var i=0; i<mocData.length; i++){
            await loadData(mocData[i])
        }
    });

    app.get('/mq', async (req, res) => {
        let out = []
        let database = await TileDocument.load(ceramic, "kjzl6cwe1jw149nt5bsoyni2pd74yoemp43k8g6kr789lebgklj3jjx2ps0qngv");
        let result = await ceramic.multiQuery(database.content.data);
        let keys = Object.keys(result);
        keys.forEach(key => {
            obj = {}
            out.push({...result[key].content, "key": key});
        });

        res.send(JSON.stringify(out));
        //res.send('Hello Wolrd!');
    });

    
    app.listen(port, () => {

        console.log(`Using ${ceramic.did._id}`);
        console.log(`Example app listening at http://localhost:${port}`)
    });

    
}

run().catch(console.error);

//record schema: kjzl6cwe1jw14azx5fej1eq6dsu0j6lo0mh5eiqrt0eo768oq9z1t4e8r2om9zq
//db schema: kjzl6cwe1jw146liocrczytyeesm23asu89rtyl6f7e7csdal3d7bycrq7e5zo7
//db streamid: kjzl6cwe1jw148d384e00juj0sho9r5er8ju462545afehveirvzjbraxkjrxwi
