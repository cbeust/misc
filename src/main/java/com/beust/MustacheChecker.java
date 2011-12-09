package com.beust;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Stack;

public class MustacheChecker {
    private boolean verbose = false;

    public MustacheChecker(String fileName) throws IOException {
        run(new File(fileName));
    }
    
    private void run(File f) throws IOException {
        if (f.isFile()) {
            runOnFile(f);
        } else {
            runOnDirectory(f);
        }
    }

    private void runOnDirectory(File dir) throws IOException {
        for (File f : dir.listFiles()) {
            run(f);
        }
    }

    private void runOnFile(File f) throws IOException {
        if (! f.getName().endsWith("M.tpl")) return;

        System.out.println("Checking " + f);
        BufferedReader br = new BufferedReader(new FileReader(f));
        String line = br.readLine();
        int lineNumber = 1;
        Stack<String> tags = new Stack<String>();
        boolean inComment = false;
        while (line != null) {
            for (int i = 0; i < line.length(); i++) {
                if (line.contains("<!--")) inComment = true;
                if (line.contains("-->")) inComment = false;

                if (line.charAt(i) == '{') {
                    if (i + 1 < line.length() && line.charAt(i + 1) == '{') {
                        i++;
                        int start = i + 1;
                        while (i < line.length() && line.charAt(i) != '}') i++;
                        if (i + 1 < line.length() && line.charAt(i + 1) == '}') {
                            String tag = line.substring(start, i);
                            if (verbose) {
                                System.out.println("Found tag:" + tag);
                            }
                            if (tag.startsWith("#") || tag.startsWith("^")) {
                                tags.push(tag.substring(1));
                            } else if (tag.startsWith("/")) {
                                if (tags.isEmpty()) {
                                    error(lineNumber, i,
                                            "Closing a tag that was never opened: " + tag);
                                } else {
                                    String closingTag = tags.pop();
                                    if (!closingTag.equals(tag.substring(1))) {
                                        error(lineNumber, i,
                                                "Closing the wrong tag:" + tag + ", expected "
                                                + closingTag);
                                    }
                                }
                            }
                        } else {
                            if (i + 1 >= line.length() || line.charAt(i + 1) != '}' && !inComment) {
                                warn(lineNumber, i, "Single closing brace");
                            }
                        }
                    } else if (!inComment) {
                        warn(lineNumber, i, "Single opening brace");
                    }
                }
            }
            lineNumber++;
            line = br.readLine();
        }
        if (!tags.isEmpty()) {
            error(-1, -1, "Tag " + tags.peek() + " was never closed");
        }
    }

    private static String where(int line, int column) {
        if (line != -1) return line + ":" + column + ": ";
        else return "";
    }

    private static void warn(int line, int column, String message) {
        System.out.println("Warning " + where(line, column) + message);
    }

    private static void error(int line, int column, String message) {
        System.out.println("Error " + where(line, column) + message);
    }

    public static void main(String[] args) throws IOException {
        String file = "/Users/cedric/dev/main/backend/admin/static/static/app/pages/Id2";
        new MustacheChecker(file);
        System.out.println("Mustache checker done");
    }
}
