import { green, red, bold } from 'yoctocolors';

const spin = [
    `[${green('   ')}]`,
    `[${green('.  ')}]`,
    `[${green('.. ')}]`,
    `[${green('...')}]`,
]

export function spinner(message,num){
    message = num ? `${bold(num)}. ${message}` : message;
    let i = 0;
    const timer = setInterval(()=>{
        process.stdout.write(`${message}. ${spin[i++]}\r`);
        if(i === spin.length) i = 0;
    },500);
    return (ok) => {
        if(ok === undefined) ok = true;
        clearInterval(timer);
        if(ok)
            process.stdout.write(`${message}. ${green('✔')} Done!\n`);
        else
            process.stdout.write(`${message}. ${red('✖')} Fail!\n`);
    }
}