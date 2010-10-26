package uncertain.ide.eclipse.action;

import org.eclipse.jface.wizard.WizardDialog;
import org.eclipse.swt.widgets.Shell;

import uncertain.composite.CompositeMap;
import uncertain.composite.QualifiedName;
import uncertain.ide.eclipse.editor.IViewer;
import uncertain.ide.eclipse.wizards.DataSetWizard;

public class AddDataSetAction extends AddElementAction {

	public AddDataSetAction(IViewer viewer, CompositeMap parentCM,
			String prefix, String uri, String cmName,String text) {
		super(viewer,parentCM,prefix,uri,cmName,text);
	}

	public AddDataSetAction(IViewer viewer, CompositeMap parentCM,QualifiedName qName) {
		super(viewer,parentCM,qName);
	}

	public void run() {
		
		callWizard();
		if (viewer != null) {
			viewer.refresh(true);
		}
	}
	private void callWizard() {
		DataSetWizard  wizard = new DataSetWizard(parent,prefix,uri,localName);
		WizardDialog dialog = new WizardDialog(new Shell(),wizard);
		dialog.open();
	}
}
