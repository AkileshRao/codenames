export const createRandomEntity = (type: 'room' | 'user') => {
    return `${type}_${Math.floor(Math.random() * 100000000)}`;
}
