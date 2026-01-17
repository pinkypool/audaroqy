import fs from 'fs';
import path from 'path';
import LevelsClient from './LevelsClient';

export default function LevelsPage() {
    const coversPath = path.join(process.cwd(), 'covers.txt');
    const coversData = fs.readFileSync(coversPath, 'utf8');
    const covers = JSON.parse(coversData);

    return <LevelsClient covers={covers} />;
}
