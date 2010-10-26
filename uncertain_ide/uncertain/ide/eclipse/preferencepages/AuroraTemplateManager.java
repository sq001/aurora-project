package uncertain.ide.eclipse.preferencepages;

import java.io.IOException;

import org.eclipse.jface.preference.IPreferenceStore;
import org.eclipse.jface.text.templates.ContextTypeRegistry;
import org.eclipse.jface.text.templates.persistence.TemplateStore;
import org.eclipse.ui.editors.text.templates.ContributionContextTypeRegistry;
import org.eclipse.ui.editors.text.templates.ContributionTemplateStore;

import uncertain.ide.Activator;

public class AuroraTemplateManager {
	private static final String CUSTOM_TEMPLATES_KEY = Activator.PLUGIN_ID
			+ ".customtemplates";
	private static AuroraTemplateManager instance;
	private TemplateStore store;
	private ContributionContextTypeRegistry registry;

	private AuroraTemplateManager() {
	}

	public static AuroraTemplateManager getInstance() {
		if (instance == null) {
			instance = new AuroraTemplateManager();
		}
		return instance;
	}

	public TemplateStore getTemplateStore() {

		if (store == null) {
			store = new ContributionTemplateStore(getContextTypeRegistry(),
					Activator.getDefault().getPreferenceStore(),
					CUSTOM_TEMPLATES_KEY);
			try {
				store.load();
			} catch (IOException e) {
				e.printStackTrace();

			}
		}
		return store;
	}

	public ContextTypeRegistry getContextTypeRegistry() {
		if (registry == null) {
			registry = new ContributionContextTypeRegistry();
		}
		registry.addContextType(AuroraTemplateContextType.new_screen);
		return registry;
	}

	public IPreferenceStore getPreferenceStore() {
		return Activator.getDefault().getPreferenceStore();
	}

}
