export class Gateways {
 data: Gateway[]
}


export class Gateway {
    gatewayId: string;
    userIds: string[];
    name: string;
    type: string;
    apiKey: string;
    secondaryApiKey: string;
    description: string;
}