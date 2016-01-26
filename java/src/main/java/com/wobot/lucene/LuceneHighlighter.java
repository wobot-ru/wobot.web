package com.wobot.lucene;

import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.ru.RussianAnalyzer;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.highlight.*;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

public class LuceneHighlighter {
    public String[] Highlight(String text, String term, int fragmentSize, int maxNumFragments, String preTags, String postTags) throws IOException, InvalidTokenOffsetsException, ParseException {
        String FIELD_NAME = "text";

        RussianAnalyzer analyzer = new RussianAnalyzer();
        Query query = new QueryParser(FIELD_NAME, analyzer).parse(term);

        SimpleHTMLFormatter simpleHTMLFormatter = new SimpleHTMLFormatter(preTags, postTags);
        SimpleHTMLEncoder simpleHTMLEncoder = new SimpleHTMLEncoder();

        QueryScorer scorer = new QueryScorer(query);
        Highlighter highlighter = new Highlighter(simpleHTMLFormatter, simpleHTMLEncoder, scorer);
        highlighter.setTextFragmenter(new SimpleSpanFragmenter(scorer, fragmentSize));

        TokenStream tokenStream = analyzer.tokenStream(FIELD_NAME, new StringReader(text));
        TextFragment[] textFragments = highlighter.getBestTextFragments(tokenStream, text, false, maxNumFragments);
        ArrayList<String> fragments = new ArrayList<String>();
        for (TextFragment textFragment : textFragments) {
            if (textFragment != null && textFragment.getScore() > 0) {
                fragments.add(textFragment.toString());
            }
        }
        return fragments.toArray(new String[fragments.size()]);
    }
}
