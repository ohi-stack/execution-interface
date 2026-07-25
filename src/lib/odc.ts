export const ODC_TOKEN = {
  name: 'OneGodian Digital Coin', symbol: 'ODC', formerName: 'Onegodian DiFi Coin',
  network: 'Ethereum Mainnet', chainId: 1, standard: 'ERC-20',
  contractAddress: '0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98', decimals: 18,
  maximumSupply: '777000000000', maximumSupplyFormatted: '777,000,000,000 ODC',
  developer: 'Gregory L. Jones', organization: 'ONEGODIAN, LLC',
  primaryNode: 'https://odc.onegodian.com',
  publicClassification: 'Digital utility token for the OneGodian commercial ecosystem',
} as const;

// Backwards compatible alias used by established platform pages.
export const ODC = { ...ODC_TOKEN, contract: ODC_TOKEN.contractAddress, canonicalUrl: ODC_TOKEN.primaryNode, version: '0.2.0' } as const;
export const serviceStates = ['operational','degraded','partial-outage','major-outage','maintenance','in-development','planned','under-review','discontinued'] as const;
export type ServiceState = typeof serviceStates[number];
export type FeatureStatus = ServiceState;
export const statusLabels: Record<ServiceState,string> = {
  operational:'Live', degraded:'Degraded performance', 'partial-outage':'Partial outage', 'major-outage':'Major outage', maintenance:'Maintenance',
  'in-development':'In development', planned:'Planned', 'under-review':'Under review', discontinued:'Discontinued'
};
export type Service = {name:string;description:string;state:ServiceState;production:boolean;lastChecked:string;lastStateChange:string;message:string;href?:string;incidents:string[]};
const stamp = '2026-07-25T14:00:00.000Z';
const service=(name:string,description:string,state:ServiceState,production:boolean,href?:string):Service=>({name,description,state,production,href,lastChecked:stamp,lastStateChange:stamp,message:statusLabels[state],incidents:[]});
export const services: Service[] = [
  service('Public website','Public ODC information pages.','operational',true,'/'), service('Token page','Canonical token record.','operational',true,'/token'),
  service('Contract-data service','Static verified contract identity; live permissions pending.','operational',true,'/contract'), service('Explorer service','Provider-backed blockchain lookup.','in-development',false,'/explorer'),
  service('Documentation','Public integration and safety guidance.','operational',true,'/docs'), service('Disclosures','Public risk and scope notices.','operational',true,'/disclosures'),
  service('Ethereum RPC','Live Ethereum connection.','in-development',false), service('Transaction indexing','ODC transfer indexing.','in-development',false),
  service('Address lookup','Provider-backed address lookup.','in-development',false), service('Transaction lookup','Provider-backed transaction lookup.','in-development',false),
  service('ODC account system','User accounts.','planned',false), service('Wallet interface','Non-custodial wallet interface.','planned',false),
  service('Payment infrastructure','Payment gateway.','under-review',false), service('WooCommerce bridge','Commerce integration.','in-development',false),
  service('Merchant tools','Merchant services.','planned',false), service('Rewards infrastructure','Rewards services.','under-review',false),
  service('Marketplace integration','Marketplace transactions.','in-development',false), service('Gaming integrations','Gaming applications.','planned',false)
];
export const features = services.map(({name,state})=>({name,status:state}));
export function overallStatus(items=services):ServiceState { const live=items.filter(i=>i.production); if(live.some(i=>i.state==='major-outage')) return 'major-outage'; if(live.some(i=>i.state==='partial-outage')) return 'partial-outage'; if(live.some(i=>i.state==='degraded')) return 'degraded'; if(live.some(i=>i.state==='maintenance')) return 'maintenance'; return 'operational'; }
export function apiSuccess<T>(data:T){return {success:true as const,data,meta:{timestamp:new Date().toISOString(),version:ODC.version}}}
export function apiError(code:string,message:string){return {success:false as const,error:{code,message},meta:{timestamp:new Date().toISOString(),version:ODC.version}}}
export const apiPayload = apiSuccess;
export const cacheHeaders = {'Cache-Control':'public, max-age=60, stale-while-revalidate=300'};
