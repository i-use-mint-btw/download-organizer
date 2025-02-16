import * as fs from "node:fs"
import * as path from "node:path"
import * as readln from "readline"
import {getConfigPath, createDefaultConfig, AppConfig, parseConfig, getDownloadDirectory} from "./config"

const configPath = getConfigPath()
let config: AppConfig | null = null

if (!configPath) {
    console.error("Failed to determine where to store the configuration file")
    process.exit(1)
}

if (!fs.existsSync(configPath)) {
    const promptInterface = readln.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    promptInterface.question("You dont have a configuration file yet. would you like to use the default config? (y / n): ", input => {
        if (input === "y") {

            createDefaultConfig(configPath)

            if (!fs.existsSync(configPath)) {
                console.error("Failed to find or create a configuration file")
                process.exit(1)
            }

            console.log(`Configuration successfully wrote to ${configPath}`)
        }
        else if (input === "n") {
            console.log(`Please create a custom configuration file at ${configPath} and re-run the program.`)
            process.exit(0)
        }
        promptInterface.close()
        main(configPath)
    })
}
else main(configPath)

function main(configPath: string) {
    config = parseConfig(configPath)

    if (!config) {
        console.error("Failed to parse config")
        process.exit(1)
    }

    const downloadDirectory = getDownloadDirectory()

    if (!downloadDirectory) {
        console.error("Failed to find download directory")
        process.exit(1)
    }

    for (let i = 0; i < config.length; i++) {
        const entry = config[i]
        let entryPath: string; 

        if (entry.dest === "$Downloads") {
            entryPath = path.join(downloadDirectory, entry.type)
        }
        else {
            entryPath = entry.dest
        }
        
        if (!fs.existsSync(entryPath)) {
            fs.mkdirSync(entryPath, {recursive: true})
        }

        const dirents = fs.readdirSync(downloadDirectory, {withFileTypes: true})

        // Search downloads for any file extension specified for the following entry
        for (const ext of entry.extensions) {
            for (const dirent of dirents) {
                if (dirent.isFile() && dirent.name.includes(`.${ext}`)) {
                    fs.renameSync(path.join(downloadDirectory, dirent.name), path.join(entryPath, dirent.name))
                }
            }
        }
    }

    console.log("Program finished successfully :)")
}