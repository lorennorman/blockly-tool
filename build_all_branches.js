import { promisify } from 'util'
import { exec } from 'child_process'
import { argv } from 'process'


const pexec = promisify(exec)

const build_all_branches = async () => {
  // check we're on main
  const { stdout } = await pexec("git branch")

  if(!stdout.match(/^\* main$/m)) {
    console.error("Oops, not on main branch. Switch to main and try again?")
  }

  let prependBase = "/"
  if(argv[2]?.startsWith("--base=")) {
    prependBase = argv[2].split("=")[1]
  }
  console.log("Prepending base:", prependBase)

  // get all non-main branches
  const branches = stdout
    .split("\n")
    .filter(branch => branch.length && branch != "* main")
    .map(branch => branch.trim())

  console.log("Building main...")
  await pexec(`vite build --base=${prependBase}`)

  console.log("Branches to build:", branches)
  try {
    // for each other branch:
    for(let i = 0; i < branches.length; i++) {
      const branch = branches[i]
      console.log(`Building branch: ${branch}...`)
      //   check out branch
      await pexec(`git checkout ${branch}`)
      //   build with outDir=dist/{branch_name} and no clean
      await pexec(`vite build --outDir dist/${branch} --base ${prependBase}${branch}/`)
    }

  } finally {
    await pexec(`git checkout main`)
  }
}

build_all_branches()
