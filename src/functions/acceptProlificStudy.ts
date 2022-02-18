import { authHeader } from "../pages/background"

export function acceptProlificStudy(study_id: string) {
  const { name, value } = authHeader
  const headers = { [name]: value }
  headers["content-type"] = "application/json;charset=UTF-8";

  // omit credentials here, since auth is handled via the bearer token
  fetch("https://www.prolific.co/api/v1/submissions/", {
    headers,
    "body": "{\"study_id\":\"" + study_id + "\"}",
    "method": "POST",
    "credentials": "omit"
  });
}
