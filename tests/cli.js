const {spawn} = require('child_process');
const stripAnsi = require('strip-ansi');

module.exports = function(command,story,options){
    const cmd = command.split(' ')[0];
    const args = command.split(' ').slice(1);
    story = story || [];

    options = Object.assign({
        timeout: 60000,
        verbose: false
    },options);

    return new Promise( resolve => {
        const result = {err:null,story:[],stdout:'',stderr:''}

        const child = spawn(cmd, args, {
            cwd: options.cwd,
        });

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        const storylength = story.length;

        let next = story.shift();
        child.stdout.on('data', data => {
            const chunk = stripAnsi(data.toString());
            if(options.verbose) console.log(chunk);
            result.stdout += chunk;
            if(next) {
                if(chunk.indexOf(next.wait) > -1){
                    if(next.reply) {
                        if(!Array.isArray(next.reply)) next.reply = [next.reply];
                        next.reply.forEach( input => child.stdin.write(input));
                    }
                    result.story.push('PASS: '+next.wait+(next.reply ? ' -> '+next.reply : ''));
                    next = story.shift();
                    if(!next) child.kill();
                }
            }            
        });

        child.stderr.on('data', data => {
            result.err = String(data); 
            result.stderr += result.err; 
        });

        let timeout;
        child.on('close', code => {
            if(timeout) clearTimeout(timeout);
            if(storylength !== result.story.length) result.err = 'Incomplete story';
            if (code) result.err = code;
            resolve(result);
        });

        timeout = setTimeout(_ =>child.kill(), options.timeout);
    } );
}