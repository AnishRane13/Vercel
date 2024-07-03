import { createClient, commandOptions} from "redis";

const subscriber = createClient();

async function main() {
    while(1){
        const response = await client.brPop(
            commandOptions({ isolated: true}),
            'build-queue',
            0
        );
        console.log(response)
    }
}
main();