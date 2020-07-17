import { Connection, createConnections } from 'typeorm';

// Pesquisa automaticamente por um arquivo chamado ormconfig
const connections: Promise<Connection[]> = createConnections();

export default connections;
