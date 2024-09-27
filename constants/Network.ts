interface NetworkConfig {
    serverip: string;
  }
  
  const network: NetworkConfig = {
    serverip: "https://leadsystemfunnel-production.up.railway.app/api", 
    //serverip: "http://192.168.1.195:8080",  // NUOVO
  };
  
  export default network;
  