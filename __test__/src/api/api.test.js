'use strict';
/** import third party modules */
import app from '../../../src/app';
import superagent from 'superagent';
import mongoose from 'mongoose';
import Employees from '../../../src/models/employees';
import Skills from '../../../src/models/skils';
describe('Simple Web Server', () => {
  var server;
  beforeAll( () => {
    server = app.start(8080);
  });
  afterAll( () => {
    /** drop employees collection created for test execution */
    mongoose.connection.db.dropCollection('employees',(err)=>{
      if(err) throw err;

      else{
        console.log('successfully dropped employees collection');
      }});
      mongoose.connection.db.dropCollection('skills',(err)=>{
        if(err) throw err;
  
        else{
          console.log('successfully dropped skills collection');
        }});

    /** close server port connection */
    server.close();
  });
  it('handles status code 200 for a post request to create employee record', () => {
    let obj = {'id':'123','name': `Joe`,'department':'Marketing','title':'Executive','location': 'WA-USA'};
    return superagent.post(`http://localhost:8080/api/v1/employees/`)
      .send(obj)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining('Marketing'));
      });

  });
  it('handles status code 400 for a bad post request with empty object passed', () => {
    return superagent.post(`http://localhost:8080/api/v1/employees/`)
      .catch(response => {
        expect(response.status).toEqual(400);
        expect(response.toString()).toEqual('Error: Bad Request');
      });
  });
  it('handles status code 200 for a put request to update existing employee record', () => {
    let obj = {'id':'32','name': `Sara`,'department':'HR','title':'SR.Manager','location': 'OR-USA'};
    let updatedObj = {'id':'32','name': `Sara`,'department':'HR','title':'Director','location': 'CA-USA'};
    return superagent.post(`http://localhost:8080/api/v1/employees/`)
      .send(obj)
      .then(response => {
        let postedRecord = JSON.parse(response.text);
        return superagent.put(`http://localhost:8080/api/v1/employees/${postedRecord._id}`)
          .send(updatedObj)
          .then(response => {
            let receivedContent = JSON.parse(response.text);
            expect(response.status).toEqual(200);
            expect(receivedContent.title).toEqual('Director');
          });
      });
  });
  it('handles status code 400 for a bad PUT request with empty object passed', () => {
    return superagent.put(`http://localhost:8080/api/v1/employees/322`)
      .catch(response => {
        expect(response.status).toEqual(400);
        expect(response.toString()).toEqual('Error: Bad Request');
      });
  });
  it('handles status code 404 for a valid PUT request made with an id that was not found', () => {
    let updatedObj = {'id':'8787','name': `Jacob`,'department':'HR','title':'Director','location': 'CA-USA'};
    return superagent.put(`http://localhost:8080/api/v1/employees/8787`)
      .send(updatedObj)
      .catch(response => {
        expect(response.status).toEqual(404);
        expect(response.toString()).toEqual(expect.stringContaining('Not Found'));
      });
  });
  it('handles status code 200 for a post request for posting to skills model', () => {
    const skillObj = {languages: 'python', role: 'QA'};
    return superagent.post(`http://localhost:8080/api/v1/skills/`)
    .send(skillObj)
    .then(response=>{
      const python = JSON.parse(response.text);
      expect(python.languages).toEqual(skillObj.languages);
    })
  });
  it('handles status code 200 for a get request for populating employee with skills', () => {

    const skillObj = {languages: 'python', role: 'QA'};    
    return superagent.post(`http://localhost:8080/api/v1/skills/`)
    .send(skillObj)
    .then(response=>{
      const python = JSON.parse(response.text);
      expect(python.languages).toEqual(skillObj.languages);
      const obj = {'id':'927','name': 'Justin','department':'Finance','title':'Manager','location': 'TX-USA',skill:python._id};
    return superagent.post(`http://localhost:8080/api/v1/employees/`)
      .send(obj)
      .then(response => {
        let postedRecord = JSON.parse(response.text);
        return superagent.get(`http://localhost:8080/api/v1/employees/${postedRecord._id}`)
          .then(response => {
            let receivedContent = JSON.parse(response.text);
            expect(response.status).toEqual(200);
            expect(receivedContent.skill.role).toEqual('QA');
          });
      });
    })
  });
  it('handles status code 200 for a get request for getting valid employee without populating skill', () => {
    let obj = {'id':'927','name': 'Justin','department':'Finance','title':'Manager','location': 'TX-USA'};
    return superagent.post('http://localhost:8080/api/v1/employees/')
      .send(obj)
      .then(response => {
        let postedRecord = JSON.parse(response.text);
        return superagent.get(`http://localhost:8080/api/v1/employees/${postedRecord._id}`)
          .then(response => {
            let receivedContent = JSON.parse(response.text);
            expect(response.status).toEqual(200);
            expect(receivedContent.name).toEqual('Justin');
          });
      });
  });
  it('handles status code 200 for a get request for all records', () => {
   
        return superagent.get(`http://localhost:8080/api/v1/employees`)
          .then(response => {
            let receivedContent = JSON.parse(response.text);
            expect(response.status).toEqual(200);
            expect(receivedContent.length).toEqual(4);
          });
      
  });
  it('handles status code 400 for a bad get request made with an empty id passed', () => {
    return superagent.get(`http://localhost:8080/api/v1/employees/`)
      .catch(response => {
        expect(response.status).toEqual(400);
        expect(response.toString()).toEqual('Error: Bad Request');
      });
  });
  it('handles status code 404 for a valid get request made with id that was not found', () => {
    let id = 2222;
    return superagent.get(`http://localhost:8080/api/v1/employees/${id}`)
      .catch(response => {
        expect(response.status).toEqual(404);
        expect(response.toString()).toEqual(expect.stringContaining('Not Found'));
      });
  });

  it('handles status code 200 for a delete request for employee that has valid id', () => {
    let obj = {'id':'655','name': 'Riya','department':'Payroll','title':'Engineer','location': 'NJ-USA'};
    return superagent.post(`http://localhost:8080/api/v1/employees/`)
      .send(obj)
      .then(response => {
        let postedRecord = JSON.parse(response.text);
        return superagent.delete(`http://localhost:8080/api/v1/employees/${postedRecord._id}`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.text).toEqual(expect.stringContaining('deleted'));
          });
      });
  });
  it('handles status code 404 for a valid delete request made with invalid id', () => {
    return superagent.delete(`http://localhost:8080/api/v1/employees/1111`)
      .catch(response => {
        expect(response.status).toEqual(404);
        expect(response.toString()).toEqual('Error: Not Found');
      });
  });
  it('handles status code 400 for a bad delete request when no id passed in', () => {
    return superagent.delete(`http://localhost:8080/api/v1/employees/`)
      .catch(response => {
        expect(response.status).toEqual(400);
        expect(response.toString()).toEqual('Error: Bad Request');
      });
  });
  it('handles a 404 error for every unhandled route', () => {
    return superagent.delete(`http://localhost:8080/api/v1/`)
      .catch(response => {
        expect(response.status).toEqual(404);
        expect(response.toString()).toEqual('Error: Not Found');
      });
  });
});
describe('employee module', () => {
  afterAll( () => {
    /** drop employees collection created for test execution */
    mongoose.connection.db.dropCollection('employees',(err)=>{
      if(err) throw err;

      else{
        console.log('successfully dropped employees collection');
      }});
      mongoose.connection.db.dropCollection('skills',(err)=>{
        if(err) throw err;
  
        else{
          console.log('successfully dropped skills collection');
        }});
  });
  it('should return empty when requested first time',async()=>{
    const employees = await Employees.find();
    expect(employees).toEqual([]);
  });

  it('should create new employee record',async()=>{
    const empObj = {'id':'123','name': `Joe`,'department':'Marketing','title':'Executive','location': 'WA-USA'};

    const joe = await Employees.create(empObj);
    expect(joe.name).toEqual(empObj.name);
  });
  it('should populate skills for employee',async()=>{
    const skillObj = {languages: 'javaScript', role: 'developer'};
    const javaScript = await Skills.create(skillObj);
    expect(javaScript.languages).toEqual(skillObj.languages);
    const empObj = {'id':'123','name': `Joe`,'department':'Marketing','title':'Executive','location': 'WA-USA',skill:javaScript._id};
    const joe = await Employees.create(empObj);
    expect(joe.name).toEqual(empObj.name);
    const foundJoe = await Employees.findById(joe._id).populate('skill').exec();
    expect(foundJoe.skill.role).toBe(skillObj.role);
  });
});