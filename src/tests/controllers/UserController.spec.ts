import { describe } from "mocha";
import { expect } from "chai";

import * as supertest from "supertest";
import { Response, SuperTest } from "supertest";
import IUser from "../../models/IUser";
import IAvatarResponse from "../../models/IAvatarResponse";

const request: SuperTest<supertest.Test> = supertest("http://localhost:8080/api");

describe('GET /api/user', () => {
    context("GET /api/user/{id}", () => {
        context("when call is made with valid user id", () => {
            const userOne: IUser = {
                id: 1,
                email: "george.bluth@reqres.in",
                first_name: "George",
                last_name: "Bluth",
                avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
            };

            it('responds 200 OK with correct data', () => {
                return request.get('/user/1')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: Response) => {
                    expect(response.body).to.be.eql(userOne)
                });
            });
        });

        context("when call is made with invalid user id", () => {
            const error: { error: string } = {
                error: "404 - \"{}\""
            };

            it('responds 404 not found', () => {
                return request.get('/user/1234567890')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((response: Response) => {
                    expect(response.body).to.be.eql(error)
                });
            });
        });
    });

    context("GET /api/user/{id}/avatar", () => {
        context("when call is made with valid user id", () => {
            const avatarResponse: IAvatarResponse = {
                avatar: "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"
            };

            it('responds 200 OK with correct data', () => {
                return request.get('/user/1/avatar')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response: Response) => {
                    expect(response.body).to.be.eql(avatarResponse)
                });
            });
        });

        context("when call is made with invalid user id", () => {
            const error: { error: string } = {
                error: "404 - \"{}\""
            };

            it('responds 404 not found', () => {
                return request.get('/user/1234567890/avatar')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((response: Response) => {
                    expect(response.body).to.be.eql(error)
                });
            });
        });
    });
});
