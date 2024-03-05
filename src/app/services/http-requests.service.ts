import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloud_function_base_url } from "../constants";
import { ChatRequestData } from "../models/chat-request";
import * as CircularJson from "circular-json";

@Injectable({
  providedIn: "root",
})
export class HttpRequestsService {
  constructor(private http: HttpClient) {}

  removeDesigner(m_uid: string, d_uid: string) {
    const url =
      cloud_function_base_url +
      "/disconnect_designer?m_uid=" +
      m_uid +
      "&d_uid=" +
      d_uid;
    return this.http.get(url);
  }
  changeVip(m_uid: string, d_uid: string, vip: boolean) {
    const url =
      cloud_function_base_url +
      "/change_vip?m_uid=" +
      m_uid +
      "&d_uid=" +
      d_uid +
      "&vip=" +
      vip;
    return this.http.get(url);
  }

  insertDesignerRequest(
    chatRequestData: ChatRequestData,
    isSpecificDesigner: boolean
  ) {
    if (isSpecificDesigner) {
      return this.http.post(
        "https://europe-west2-furniin-d393f.cloudfunctions.net/insert_request_specific_designers",
        CircularJson.stringify(chatRequestData)
      );
    } else {
      return this.http.post(
        "https://europe-west2-furniin-d393f.cloudfunctions.net/insert_request",
        CircularJson.stringify(chatRequestData)
      );
    }
  }
}
