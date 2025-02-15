export {}
interface Test {
    a: string;
    b: number;
    c: boolean;
}

const test: Test = {
    a: "foo",
    b: 111,
    c: true
};

await new Promise<void>(done => setTimeout(done, 100));
console.log('typescript');
