import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { parse } from 'cookie';

@Injectable()
export class GameService {
  constructor(private authenticationService: AuthenticationService) {}
}
