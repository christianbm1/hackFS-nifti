require("dotenv").config();

const request = require('request');
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
var cors = require('cors')  


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
//const mocData = require("./data/data.json");

const Web3Storage = require('web3.storage').default;

const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

function getAccessToken() {
    return process.env.WEB3STORAGE_TOKEN
}
  
function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}

function makeFileObjects() {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { hello: 'world' }
    const buffer = Buffer.from(JSON.stringify(obj));
  
    const files = [
      new Web3Storage.File(['contents-of-file-1'], 'plain-utf8.txt'),
      new Web3Storage.File([buffer], 'hello.json')
    ]
    return files
}

async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    return cid;
}

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

/*
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
*/
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
        res.send('Hello World! - NiFTi')
    })

    /* Create a schema for each record */
    /*
    app.get('/recordSchema', async (req, res) => {
        const metadata = {
            controllers: [ceramic.did.id] 
        }
        const recordSchema = await TileDocument.create(ceramic, recSchema, metadata)
        const streamId = recordSchema.id.toString();
        res.send(streamId);
    });
    */
    /* create the main database
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
    */
    /*
        userLat:number
        userLong:number
        metadata_uri:string | url
        content_uri:string | url
        chainId:number
        contractAddress:string
        ownerAddress:string
        tokenId:number
        category:array
        nsfw:boolean
        stat_interaction:number
        stat_impressions:number

    */ 
    app.post('/crtRec', async (req, res) => {
        //console.log(req.body);
        
        let recSchemaLd = await TileDocument.load(ceramic, "kjzl6cwe1jw148i39genxu3u8s0xoretrry2hg9p5kem5swrp8wqi4cp20wnpvq");
        const rec = await TileDocument.create(ceramic, {
            lat: req.body.lat,
            long: req.body.long,
            metadata_uri: req.body.metadata_url,
            content_cid: req.body.content_cid,
            content_filename: req.body.content_filename,
            chainId: req.body.chainId,
            contractAddress: req.body.nftContractAddress,
            ownerAddress: req.body.ownerAddress,
            tokenId: req.body.tokenId,
            category: [req.body.category],
            nsfw: req.body.nsfw ? true : false,
            contentType: req.body.content_type,
            name: req.body.name,
            desc: req.body.desc,
            stat_interaction: 0,
            stat_impressions: 0,
            txnHash: req.body.txnHash
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

    /* load mock data
    app.get('/loadit', async (rec, res) => {
        for(var i=0; i<mocData.length; i++){
            await loadData(mocData[i])
        }
    });
    */

    /* create multiquery
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
    });
    */
    server.listen(port,() => {
        console.log(`Using ${ceramic.did._id}`);
        console.log(`Listening on port ${port} . . .`);
    });

    
}

run().catch(console.error);

//record schema: kjzl6cwe1jw148i39genxu3u8s0xoretrry2hg9p5kem5swrp8wqi4cp20wnpvq
//db schema: kjzl6cwe1jw146liocrczytyeesm23asu89rtyl6f7e7csdal3d7bycrq7e5zo7
//db streamid: kjzl6cwe1jw148d384e00juj0sho9r5er8ju462545afehveirvzjbraxkjrxwi
