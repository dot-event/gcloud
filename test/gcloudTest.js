// Packages
import dotEvent from "dot-event"
import dotTask from "@dot-event/task"

// Helpers
import gcloud from "../"

async function run(...argv) {
  await events.task({
    argv,
    op: "gcloud",
    path: `${__dirname}/fixture`,
  })
}

// Constants
const cancel = ({ event }) => (event.signal.cancel = true)

// Variables
let events

// Tests
beforeEach(async () => {
  events = dotEvent()

  gcloud({ events })
  dotTask({ events })

  events.onAny({
    "before.spawn": ({ event }) => {
      cancel({ event })
      event.signal.returnValue = {}
    },
  })
})

test("gcloud cluster list", async () => {
  const calls = []

  events.onAny("before.spawn", ({ event }) =>
    calls.push(event.options)
  )

  await events.set(
    ["tasks", "fixture", "gcloudConfig", "projects"],
    ["project"]
  )

  await run("--cluster-list")

  expect(calls.length).toBe(1)
})
