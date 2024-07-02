import { promisify } from 'util'
import { exec } from 'child_process'

const pexec = promisify(exec)

const build_all_branches = async () => {
  // check we're on main
  const { stdout } = await pexec("git branch")

  if(!stdout.match(/^\* main$/m)) {
    console.error("Oops, not on main branch. Switch to main and try again?")
  }

  // get all non-main branches
  const branches = stdout
    .split("\n")
    .filter(branch => branch.length && branch != "* main")
    .map(branch => branch.trim())
  console.log("Branches:\n", branches)

  // build main
  await pexec("vite build")

  try {
    // for each other branch:
    for(let i = 0; i < branches.length; i++) {
      const branch = branches[i]
      console.log(`Building branch: ${branch}`)
      //   check out branch
      await pexec(`git checkout ${branch}`)
      //   build with outDir=dist/{branch_name} and no clean
      await pexec(`vite build --outDir dist/${branch} --base /${branch}/`)
    }

  } finally {
    await pexec(`git checkout main`)
  }
}

build_all_branches()
