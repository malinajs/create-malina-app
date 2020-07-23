import path from 'path';
import fs from 'fs';
import fetchRepoDir from 'fetch-repo-dir';
import {exec} from 'child_process';


export function isDir(dir){
    return fs.existsSync(path.resolve(dir));
}

export async function loadTemplate(source,dir){
    if(isDir(dir)) deleteFilesInDir(dir);
    await fetchRepoDir({src:source,dir:path.resolve(dir)});
};

export async function installDependencies(dir){
    await asyncExec('npm install',dir);
}


function asyncExec(command,cwd){
    if(cwd !== undefined) cwd = path.resolve(cwd);
    return new Promise( (resolve,reject) => {
        try{
            exec(command,{cwd},(err,stdout)=>{
                return err ? reject(err) : resolve(stdout);
                
            })
        }catch(e){
            reject(e.message);
        }
    });
}

function deleteFilesInDir(dirPath,delDir) {
    let files = fs.readdirSync(dirPath);
    if (files.length > 0)
      for(let file of files) {
        let filePath = path.join(dirPath,file);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
        deleteFilesInDir(filePath,true);
      }
    if(delDir) fs.rmdirSync(dirPath);
};