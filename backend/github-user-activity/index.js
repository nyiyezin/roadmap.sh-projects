import https from "https";
import process from "process";

const username = process.argv[2];
if (!username) {
  console.error("You must provide a Githhub username. Usage: github-activity <username>");
  process.exit(1);
}

function fetchFromGithub(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "user-agent": "node.js" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(JSON.parse(data).message);
          }
        });
      })
      .on("error", (err) => reject(err.message));
  });
}

const main = async () => {
  try {
    const activityUrl = `https://api.github.com/users/${username}/events`;
    const userUrl = `https://api.github.com/users/${username}`;

    const [activities, userInfo] = await Promise.all([fetchFromGithub(activityUrl), fetchFromGithub(userUrl)]);

    console.log(`\nGithub Activity for ${userInfo.login} ${userInfo.name || "No name specified!"}`);
    console.log(`Bio: ${userInfo.bio || "No bio available!"}`);
    console.log(`Location: ${userInfo.location || "No location specified!"}`);
    console.log(`Followers: ${userInfo.followers}`);
    console.log(`Repositories: ${userInfo.public_repos}\n`);

    console.log("Recent Activity: ");
    activities.slice(0, 5).forEach((event) => {
      const { type, repo } = event;
      const eventType = {
        PushEvent: `Pushed to ${repo.name}`,
        PullRequestEvent: `Opened a pull request in ${repo.name}`,
        IssuesEvent: `Opened an issue in ${repo.name}`,
        WatchEvent: `Starred ${repo.name}`,
        ForkEvent: `Forked ${repo.name}`,
      };
      console.log(`- ${eventType[type] || "Performed an action"}`);
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

main();
