const { emitAndListen, event } = require('./helpers.js');

describe('Instance listeners', () => {
    test('#on', () => {
        expect.assertions(1);

        return emitAndListen(event.count).then((res) => {
            expect(res).toBe(event.count);
        });
    });
});
