import { WMurl } from "../constant";

export const getMappings = (parameters,callback)=> {
  fetch(WMurl + '/__admin/mappings' +(parameters? '?' + parameters : ''))
    .then(res => res.json())
    .then(data => {
      callback(data);
    })
    .catch(console.log);
};
export const deleteStub = (stubId, callback) => {
  fetch(WMurl + "/__admin/mappings/" + stubId, {
    method: "DELETE"
  }).then(response => {
    callback();
  });
};
export const saveStub = (stub, callback) => {
  fetch(WMurl + "/__admin/mappings/" + stub.id, {
    method: "PUT",
    body: JSON.stringify(stub)
  }).then(response => {
    callback();
  });
};

export const createStub = (data, callback) => {
  createOptionStub(data);
  createSpecificStub(data,callback);
};
const createSpecificStub = (data, callback) => {
  fetch(WMurl + "/__admin/mappings/", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(response => {
    response.json().then(body=>callback(body));
  });
};
const createOptionStub = (data) => {
  const optionData = {...data};
  optionData.request = {...data.request};
  optionData.request.method='OPTIONS';
  optionData.persistent=false;
  fetch(WMurl + "/__admin/mappings/", {
    method: "POST",
    body: JSON.stringify(optionData)
  }).then(response => {
    
  });
};

