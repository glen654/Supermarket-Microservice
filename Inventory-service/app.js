const express = require('express');
const { Eureka } = require('eureka-js-client');


const app = express();

app.use(express.json());
const port = 3000;

const router = express.Router();

router.get('/inventory', async (req, res) => {
    res.json({
        items:['Milk','Eggs','Bread'],
        message: 'Welcome to the inventory service!'
    });
})


// application context
app.use('/inventory-service', router);

const eurekaClient = new Eureka({
    instance: {
        instanceId: "inventory-service",
        app: "INVENTORY-SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            $: port,
            "@enabled": true,
        },
        vipAddress: "inventory-service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
        servicePath: "/eureka/apps/",
    },
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    eurekaClient.start((error) => {
        if(error){
            console.error("Failed to register eureka");
        }else{
            console.log("Successfully registered eureka");
        }
    });
})