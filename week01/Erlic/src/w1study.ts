// string
const str: string = 'hi';
console.log(str);

/* const str2: string = 123;
console.log(str2); */

// number
const num: number = 123;
console.log(num);

/* const num2: number = simminsik;
alert(num2); */

// boolean
const bool: boolean = true;
console.log(bool);

/* const bool2: boolean = 123;
console.log(bool2); */

// null
let n: null = null;
console.log(n);

/* let n2: null = undefined;
console.log(n2);  */

// undefined
let u: undefined = undefined;
console.log(u);

/* let u2: undefined = null;
console.log(u2); */

//symbol /상수
const s1: symbol = Symbol('id');
console.log(s1);
/* s1: symbol = Symbol('id2'); */
const s2: symbol = Symbol('id');
console.log(s1 === s2); // false

// bigint
/* const a: bigint = 123n;  */
console.log(a);
const b = BigInt("9000");
console.log(b);

/* const c: bigint = 123;
console.log(c); */

// object
const obj: object = { name: 'simminsik', age: 23};
console.log(obj);

/* const obj2: object = 'hi'; */
/* console.log(obj2); */