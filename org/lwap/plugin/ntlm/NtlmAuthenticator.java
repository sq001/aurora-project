package org.lwap.plugin.ntlm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jcifs.Config;
import jcifs.UniAddress;
import jcifs.http.NtlmSsp;
import jcifs.ntlmssp.Type1Message;
import jcifs.ntlmssp.Type3Message;
import jcifs.smb.NtlmPasswordAuthentication;
import jcifs.smb.SmbSession;
import jcifs.util.Base64;

public class NtlmAuthenticator {
	private String defaultDomain;
	private String domainController;

	NtlmConfig ntlmConfig;

	public NtlmAuthenticator(NtlmConfig ntlmConfig) {
		this.ntlmConfig = ntlmConfig;
	}

	public NtlmPasswordAuthentication authenticate(HttpServletRequest req,
			HttpServletResponse resp) throws IOException, ServletException {
		UniAddress dc;
		String msg;
		NtlmPasswordAuthentication ntlm = null;
		msg = req.getHeader("Authorization");
		if (msg != null && msg.startsWith("NTLM ")) {
			byte[] token = Base64.decode(msg.substring(5));
			if (token[8] == 1) {
				Type1Message type1 = new Type1Message(token);
				defaultDomain = type1.getSuppliedDomain();				
			} else if (token[8] == 3) {
				Type3Message type3 = new Type3Message(token);
				defaultDomain = type3.getDomain();
			}
			DomainInstance domainInstance = (DomainInstance) this.ntlmConfig
					.getDomainInstance(defaultDomain);
			if (domainInstance == null)
				throw new RuntimeException("defaultDomain is null");
			domainController=domainInstance.getDomainController();
			
			Config.setProperty("jcifs.smb.client.domain", domainInstance.getDomain());
			Config.setProperty("jcifs.smb.client.username", domainInstance.getUserName());
			Config.setProperty("jcifs.smb.client.password", domainInstance.getPassword());
			
			byte[] challenge;
			dc = UniAddress.getByName(domainController, true);

			challenge = SmbSession.getChallenge(dc);
			
			if ((ntlm = NtlmSsp.authenticate(req, resp, challenge)) == null) {
				return null;
			}

			SmbSession.logon(dc, ntlm);
			return ntlm;
		} else {
			resp.setHeader("WWW-Authenticate", "NTLM");
			resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			resp.setContentLength(0);
			resp.flushBuffer();
			return null;
		}
	}	
}
