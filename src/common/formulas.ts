export function enemyCount(wave: number){
    return 5 * Math.pow(wave, 1.1);
}

export function troops(enemies: number){
    return enemies * 5000;
}
