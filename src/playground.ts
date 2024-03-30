import 'reflect-metadata';
import { appDataSource } from 'orm';

async function main() {
    await appDataSource.initialize();
    // Playground code here
}

process.on('unhandledRejection', console.log);

if (require.main === module) {
    main().catch(console.error);
}
