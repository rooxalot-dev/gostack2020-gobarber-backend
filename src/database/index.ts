import { Connection, createConnection } from 'typeorm';

// Pesquisa automaticamente por um arquivo chamado ormconfig
const connection: Promise<Connection> = createConnection();

export default connection;
