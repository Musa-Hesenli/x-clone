import {Controller, Post} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {responses} from "../../helpers/helpers";

@Controller("users")
export class UsersController {
    public constructor(private readonly configService: ConfigService) {}

    @Post("login")
    public login() {
        return responses.data(this.configService.get<string>('database.user', { infer: true }));
    }

    @Post("register")
    public register() {
        return "Register page";
    }
}