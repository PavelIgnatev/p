import { rulesModel } from "./../@types/rulesModel";
import { offpeakModel } from "../@types/offpeakModel";
import axios from "axios";
import ConfigApi from "./ConfigApi";
import { scoresModel } from "../@types/scoreModel";
class Api extends ConfigApi {
  async get<T>(url: string, params?: any) {
    let fullUrl: string = url;
    if (params) {
      fullUrl += "?" + new URLSearchParams(params).toString();
    }
    return (await axios(fullUrl))?.data as T;
  }
  async addSettings(settings: any) {
    return await axios.post(`/api/settings`, settings);
  }
  async addAlias(settings: any) {
    return await axios.post(`/api/aliases`, settings);
  }
  async checkAdminPassword(password: string) {
    return await axios.post(`/api/password/admin`, { password });
  }
  async postSample(sample: string) {
    return await axios.post(`/api/sample`, { sample });
  }
  async postStopWords(word: string) {
    return await axios.post(`/api/stopwords`, { word });
  }
  async deleteStopWords(word: string) {
    return await axios.delete(`/api/stopwords`, { data: { word } });
  }
  async postOffpeak(offpeak: offpeakModel) {
    return await axios.post(`/api/offpeak`, { offpeak });
  }
  async postRules(rules: rulesModel[]) {
    return await axios.post(`/api/rules`, { rules });
  }
  async postScores(scores: scoresModel[]) {
    return await axios.post(`/api/scores`, { scores });
  }
  async patchRules(rules: rulesModel[], offpeak: boolean) {
    return await axios.patch(`/api/rules`, { rules, offpeak });
  }
  async patchScores(scores: scoresModel[], offpeak: boolean) {
    return await axios.patch(`/api/scores`, { scores, offpeak });
  }
  async deleteRules(data: rulesModel[]) {
    return await axios.delete(`/api/rules`, { data });
  }
  async deleteScores(data: scoresModel[]) {
    return await axios.delete(`/api/scores`, { data });
  }
  async postUpdate() {
    return await axios.post(`/api/update`);
  }
  async getUserRules(name: string) {
    return await axios.post(`/api/user-rule?alias=${name}`);
  }
}

const api = new Api();

export default api;
