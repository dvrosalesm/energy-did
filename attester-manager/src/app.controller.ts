import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as Kilt from '@kiltprotocol/sdk-js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    setTimeout(() => {
      this.appService.registerCTypes();
    }, 5000);
  }

  @Post('/requestAttestation')
  requestAttestation(
    @Body('credential') credential: Kilt.ICredential,
    @Body('claimer') claimer: Kilt.DidUri,
  ): void {
    this.appService.requestAttestation(credential, claimer);
  }

  @Get('/getAttestations/:claimer')
  getAttestations(@Param('claimer') claimer: Kilt.DidUri) {
    return this.appService.getAttestations(claimer);
  }

  @Get('/getAllAttestations')
  getAllAttestations() {
    return this.appService.getAllAttestations();
  }

  @Get('/getChallenge')
  getChallenge() {
    const challenge = this.appService.getPublicChallenge();
    return {
      challenge,
    };
  }

  @Post('/requestVerification')
  async requestVerification(
    @Body('id') id: string,
    @Body('challenge') challenge: string,
    @Body('verifier') verifier: string,
  ) {
    await this.appService.requestVerification(id, challenge, verifier);
  }

  @Post('/attestClaim')
  async attestClaim(
    @Body('id') id: string,
    @Body('signedChallenge') signedChallenge: string,
  ) {
    return await this.appService.attestCredential(id, signedChallenge);
  }

  @Post('/submitVerification')
  async submitVerification(
    @Body('id') id: Kilt.DidUri,
    @Body('presentation') presentation: Kilt.ICredentialPresentation,
    @Body('challenge') challenge: string,
  ) {
    return await this.appService.submitVerification(
      id,
      presentation,
      challenge,
    );
  }
}
