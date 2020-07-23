import k from 'kleur';

const spin = [
    `[${k.green('   ')}]`,
    `[${k.green('.  ')}]`,
    `[${k.green('.. ')}]`,
    `[${k.green('...')}]`,
]

export function spinner(message,num){
    message = num ? `${k.bold(num)}. ${message}` : message;
    let i = 0;
    const timer = setInterval(()=>{
        process.stdout.write(`${message}. ${spin[i++]}\r`);
        if(i === spin.length) i = 0;
    },500);
    return (ok) => {
        if(ok === undefined) ok = true;
        clearInterval(timer);
        if(ok)
            process.stdout.write(`${message}. ${k.green('✔')} Done!\n`);
        else
            process.stdout.write(`${message}. ${k.red('✖')} Fail!\n`);
    }
}